/*
 * A partial implementation of HTTP/1.0
 *
 * This code is mainly intended as a replacement for the book's 'tiny.c' server
 * It provides a *partial* implementation of HTTP/1.0 which can form a basis for
 * the assignment.
 *
 * @author G. Back for CS 3214 Spring 2018
 */
#include <sys/types.h>
#include <sys/socket.h>
#include <sys/stat.h>
#include <dirent.h>
#include <string.h>
#include <stdarg.h>
#include <stdio.h>
#include <stdbool.h>
#include <errno.h>
#include <unistd.h>
#include <time.h>
#include <fcntl.h>
#include <linux/limits.h>
#include <jansson.h>

#include "http.h"
#include "hexdump.h"
#include "socket.h"
#include "bufio.h"
#include "main.h"

// Need macros here because of the sizeof
#define CRLF "\r\n"
#define CR "\r"
#define STARTS_WITH(field_name, header) \
    (!strncasecmp(field_name, header, sizeof(header) - 1))

extern char *server_root;
extern int token_expiration_time;

/* Parse HTTP request line, setting req_method, req_path, and req_version. */
static bool
http_parse_request(struct http_transaction *ta)
{
    size_t req_offset;
    ssize_t len = bufio_readline(ta->client->bufio, &req_offset);
    if (len < 2) // error, EOF, or less than 2 characters
        return false;

    char *request = bufio_offset2ptr(ta->client->bufio, req_offset);
    request[len - 2] = '\0'; // replace LF with 0 to ensure zero-termination
    char *endptr;
    char *method = strtok_r(request, " ", &endptr);
    if (method == NULL)
        return false;

    if (!strcmp(method, "GET"))
        ta->req_method = HTTP_GET;
    else if (!strcmp(method, "POST"))
        ta->req_method = HTTP_POST;
    else
        ta->req_method = HTTP_UNKNOWN;

    char *req_path = strtok_r(NULL, " ", &endptr);
    if (req_path == NULL)
        return false;

    ta->req_path = bufio_ptr2offset(ta->client->bufio, req_path);

    char *http_version = strtok_r(NULL, CR, &endptr);
    if (http_version == NULL) // would be HTTP 0.9
        return false;

    // record client's HTTP version in request
    if (!strcmp(http_version, "HTTP/1.1"))
        ta->req_version = HTTP_1_1;
    else if (!strcmp(http_version, "HTTP/1.0"))
        ta->req_version = HTTP_1_0;
    else
        return false;

    return true;
}

/* Process HTTP headers. */
static bool
http_process_headers(struct http_transaction *ta)
{
    for (;;)
    {
        size_t header_offset;
        ssize_t len = bufio_readline(ta->client->bufio, &header_offset);
        if (len <= 0)
            return false;

        char *header = bufio_offset2ptr(ta->client->bufio, header_offset);
        if (len == 2 && STARTS_WITH(header, CRLF)) // empty CRLF
            return true;

        header[len - 2] = '\0';
        /* Each header field consists of a name followed by a
         * colon (":") and the field value. Field names are
         * case-insensitive. The field value MAY be preceded by
         * any amount of LWS, though a single SP is preferred.
         */
        char *endptr;
        char *field_name = strtok_r(header, ":", &endptr);
        if (field_name == NULL)
            return false;

        // skip white space
        char *field_value = endptr;
        while (*field_value == ' ' || *field_value == '\t')
            field_value++;

        // you may print the header like so
        // printf("Header: %s: %s\n", field_name, field_value);
        if (!strcasecmp(field_name, "Content-Length"))
            ta->req_content_len = atoi(field_value);

        /* Handle other headers here. Both field_value and field_name
         * are zero-terminated strings.
         */
        if (!strcasecmp(field_name, "Cookie"))
        {
            // if (strstr(field_value, ";"))
            // {
            char *token = strtok(field_value, ";");
            while (token != NULL)
            {
                if (strstr(token, "auth_token"))
                {
                    char *key = strchr(token, '=');
                    key++;
                    ta->cookie = key;
                }
                token = strtok(NULL, ";");
            }
        }

        if (!strcasecmp(field_name, "Range"))
        {
            char *range = strchr(field_value, '=');
            range++;

            char *high = NULL,
                 *low = strtok_r(range, "-", &high);
            ta->range_high = strcmp(high, "") == 0 ? -1 : atoi(high);
            ta->range_low = strcmp(low, "") == 0 ? -1 : atoi(low);
            ta->range_request = true;
        }
    }
}

const int MAX_HEADER_LEN = 2048;

/* add a formatted header to the response buffer. */
void http_add_header(buffer_t *resp, char *key, char *fmt, ...)
{
    va_list ap;

    buffer_appends(resp, key);
    buffer_appends(resp, ": ");

    va_start(ap, fmt);
    char *error = buffer_ensure_capacity(resp, MAX_HEADER_LEN);
    int len = vsnprintf(error, MAX_HEADER_LEN, fmt, ap);
    resp->len += len > MAX_HEADER_LEN ? MAX_HEADER_LEN - 1 : len;
    va_end(ap);

    buffer_appends(resp, "\r\n");
}

/* add a content-length header. */
static void
add_content_length(buffer_t *res, size_t len)
{
    http_add_header(res, "Content-Length", "%ld", len);
}

/* start the response by writing the first line of the response
 * to the response buffer.  Used in send_response_header */
static void
start_response(struct http_transaction *ta, buffer_t *res)
{
    char *type = (ta->req_version == HTTP_1_0) ? "HTTP/1.0 " : "HTTP/1.1 ";
    buffer_appends(res, type);

    switch (ta->resp_status)
    {
    case HTTP_OK:
        buffer_appends(res, "200 OK");
        break;
    case HTTP_PARTIAL_CONTENT:
        buffer_appends(res, "206 Partial Content");
        break;
    case HTTP_BAD_REQUEST:
        buffer_appends(res, "400 Bad Request");
        break;
    case HTTP_PERMISSION_DENIED:
        buffer_appends(res, "403 Permission Denied");
        break;
    case HTTP_NOT_FOUND:
        buffer_appends(res, "404 Not Found");
        break;
    case HTTP_METHOD_NOT_ALLOWED:
        buffer_appends(res, "405 Method Not Allowed");
        break;
    case HTTP_REQUEST_TIMEOUT:
        buffer_appends(res, "408 Request Timeout");
        break;
    case HTTP_REQUEST_TOO_LONG:
        buffer_appends(res, "414 Request Too Long");
        break;
    case HTTP_NOT_IMPLEMENTED:
        buffer_appends(res, "501 Not Implemented");
        break;
    case HTTP_SERVICE_UNAVAILABLE:
        buffer_appends(res, "503 Service Unavailable");
        break;
    case HTTP_INTERNAL_ERROR:
    default:
        buffer_appends(res, "500 Internal Server Error");
        break;
    }
    buffer_appends(res, CRLF);
}

/* Send response headers to client */
static bool
send_response_header(struct http_transaction *ta)
{
    buffer_t response;
    buffer_init(&response, 80);

    start_response(ta, &response);
    if (bufio_sendbuffer(ta->client->bufio, &response) == -1)
        return false;

    buffer_appends(&ta->resp_headers, CRLF);
    if (bufio_sendbuffer(ta->client->bufio, &ta->resp_headers) == -1)
        return false;

    buffer_delete(&response);
    return true;
}

/* Send a full response to client with the content in resp_body. */
static bool
send_response(struct http_transaction *ta)
{
    // add content-length.  All other headers must have already been set.
    add_content_length(&ta->resp_headers, ta->resp_body.len);

    if (!send_response_header(ta))
        return false;

    return bufio_sendbuffer(ta->client->bufio, &ta->resp_body) != -1;
}

const int MAX_ERROR_LEN = 2048;

/* Send an error response. */
static bool
send_error(struct http_transaction *ta, enum http_response_status status, const char *fmt, ...)
{
    va_list ap;

    va_start(ap, fmt);
    char *error = buffer_ensure_capacity(&ta->resp_body, MAX_ERROR_LEN);
    int len = vsnprintf(error, MAX_ERROR_LEN, fmt, ap);
    ta->resp_body.len += len > MAX_ERROR_LEN ? MAX_ERROR_LEN - 1 : len;
    va_end(ap);
    ta->resp_status = status;
    http_add_header(&ta->resp_headers, "Content-Type", "text/plain");
    return send_response(ta);
}

/* Send Not Found response. */
static bool
send_not_found(struct http_transaction *ta)
{
    return send_error(ta, HTTP_NOT_FOUND, "File %s not found",
                      bufio_offset2ptr(ta->client->bufio, ta->req_path));
}

/* A start at assigning an appropriate mime type.  Real-world
 * servers use more extensive lists such as /etc/mime.types
 */
static const char *
guess_mime_type(char *filename)
{
    char *suffix = strrchr(filename, '.');
    if (suffix == NULL)
        return "text/plain";

    if (!strcasecmp(suffix, ".html"))
        return "text/html";

    if (!strcasecmp(suffix, ".gif"))
        return "image/gif";

    if (!strcasecmp(suffix, ".png"))
        return "image/png";

    if (!strcasecmp(suffix, ".jpg"))
        return "image/jpeg";

    if (!strcasecmp(suffix, ".js"))
        return "text/javascript";

    if (!strcasecmp(suffix, ".mp4"))
        return "video/mp4";

    return "text/plain";
}

/* Handle HTTP transaction for static files. */
static bool
handle_static_asset(struct http_transaction *ta, char *basedir)
{
    char fname[PATH_MAX];

    char *req_path = bufio_offset2ptr(ta->client->bufio, ta->req_path);

    snprintf(fname, sizeof fname, "%s%s", basedir, req_path);

    if (!strcmp("/", req_path) && html5_fallback)
        snprintf(fname, sizeof fname, "%s/index.html", basedir);

    if (access(fname, R_OK))
    {
        if (errno == EACCES)
            return send_error(ta, HTTP_PERMISSION_DENIED, "Permission denied.");
        else if (ta->cookie)
        {
            jwt_t *token;
            jwt_decode(&token, ta->cookie, NULL, 0);
            const char *sub = jwt_get_grant(token, "sub");
            if (strcmp(sub, "user0") != 0)
                return send_not_found(ta);
        }
        else
        {
            if (html5_fallback)
                snprintf(fname, sizeof fname, "%s/index.html", basedir);
            else
                return send_not_found(ta);
        }
    }

    int filefd = open(fname, O_RDONLY);
    if (filefd == -1)
    {
        if (html5_fallback)
            snprintf(fname, sizeof fname, "%s/index.html", basedir);
        else
            return send_not_found(ta);
    }

    // Determine file size
    struct stat st;
    int rc = stat(fname, &st);
    if (rc == -1)
    {
        if (html5_fallback)
        {
            snprintf(fname, sizeof fname, "%s/index.html", basedir);
            rc = stat(fname, &st);
        }
        else
            return send_error(ta, HTTP_INTERNAL_ERROR, "Could not stat file.");
    }

    ta->resp_status = HTTP_OK;
    http_add_header(&ta->resp_headers, "Content-Type", "%s", guess_mime_type(fname));
    http_add_header(&ta->resp_headers, "Accept-Ranges", "%s", "bytes");
    off_t from = 0, to = st.st_size - 1;

    if (ta->range_request)
    {
        ta->range_high = (ta->range_high == -1) ? st.st_size - 1 : ta->range_high;
        ta->range_low = (ta->range_low == -1) ? 0 : ta->range_low;
        http_add_header(&ta->resp_headers, "Content-Range", "%s %i-%i/%li", "bytes", ta->range_low, ta->range_high, st.st_size);
        ta->resp_status = HTTP_PARTIAL_CONTENT;
        from = ta->range_low;
        to = (ta->range_high < st.st_size) ? ta->range_high : st.st_size - 1;
    }

    off_t content_length = to + 1 - from;
    add_content_length(&ta->resp_headers, content_length);

    bool success = send_response_header(ta);
    if (!success)
        goto out;

    // sendfile may send fewer bytes than requested, hence the loop
    while (success && from <= to)
        success = bufio_sendfile(ta->client->bufio, filefd, &from, to + 1 - from) > 0;

out:
    close(filefd);
    return success;
}

static bool
handle_api(struct http_transaction *ta)
{
    // handle unwanted methods
    if (ta->req_method != HTTP_GET && ta->req_method != HTTP_POST)
        return send_error(ta, HTTP_METHOD_NOT_ALLOWED, " ");

    bool success = false;

    char *buffer = bufio_offset2ptr(ta->client->bufio, ta->req_body),
         *req_path = bufio_offset2ptr(ta->client->bufio, ta->req_path);

    char login[PATH_MAX];
    char video[PATH_MAX];
    snprintf(login, sizeof login, "%s/%s", server_root, "api/login");
    snprintf(video, sizeof video, "%s/%s", server_root, "api/video");

    if (!strcmp(req_path, login) || !strcmp(req_path, "/api/login"))
    {
        http_add_header(&ta->resp_headers, "Content-Type", "%s", "application/json");
        if (ta->req_method == HTTP_POST)
        {
            json_t *body = json_loadb(buffer, ta->req_content_len, JSON_ENSURE_ASCII, NULL),
                   *user_j = json_object_get(body, "username"),
                   *pass_j = json_object_get(body, "password");

            if (!user_j && !pass_j)
            {
                ta->resp_status = HTTP_PERMISSION_DENIED;
                buffer_appends(&ta->resp_body, "{}");
                return send_error(ta, HTTP_PERMISSION_DENIED, " ");
            }

            const char *username = json_string_value(user_j),
                       *password = json_string_value(pass_j);

            bool token_failure = false;

            jwt_t *mytoken;

            if (!strcmp(username, "user0") && !strcmp(password, "thepassword"))
                token_failure = jwt_new(&mytoken) ||
                                jwt_add_grant(mytoken, "sub", "user0") ||
                                jwt_add_grant_int(mytoken, "iat", time(NULL)) ||
                                jwt_add_grant_int(mytoken, "exp", time(NULL) + token_expiration_time) ||
                                jwt_set_alg(mytoken, JWT_ALG_HS256,
                                            (unsigned char *)password,
                                            strlen(password));

            else
            {
                ta->resp_status = HTTP_PERMISSION_DENIED;
                buffer_appends(&ta->resp_body, "{}");
                return send_error(ta, HTTP_PERMISSION_DENIED, " ");
            }

            if (token_failure)
                perror("token"), exit(EXIT_FAILURE);

            http_add_header(&ta->resp_headers,
                            "Set-Cookie",
                            "%s%s; %s",
                            "auth_token=",
                            jwt_encode_str(mytoken),
                            "Path=/");

            ta->resp_status = HTTP_OK;

            char *grants = jwt_get_grants_json(mytoken, NULL);
            buffer_appends(&ta->resp_body, grants);

            return send_response(ta);
        }
        else
        {
            ta->resp_status = HTTP_OK;
            char *cookie = ta->cookie;

            if (cookie)
            {
                jwt_t *token;
                if (!jwt_decode(&token, cookie, NULL, 0))
                {
                    char *grants = jwt_get_grants_json(token, NULL);
                    buffer_appends(&ta->resp_body, grants);
                }
                else
                    buffer_appends(&ta->resp_body, "{}");
            }
            else
                buffer_appends(&ta->resp_body, "{}");

            return send_response(ta);
        }
    }
    else if (!strcmp(req_path, video) || !strcmp(req_path, "/api/video"))
    {
        if (ta->req_method == HTTP_GET)
        {
            ta->resp_status = HTTP_OK;
            DIR *directory = opendir(server_root);
            struct dirent *file;
            json_t *arr = json_array();

            while ((file = readdir(directory)))
                if (!strcmp(guess_mime_type(file->d_name), "video/mp4"))
                {
                    char fname[PATH_MAX];
                    snprintf(fname, sizeof fname, "%s/%s", server_root, file->d_name);
                    struct stat st;
                    stat(fname, &st);
                    json_t *mp4 = json_object();
                    json_object_set_new(mp4, "size", json_integer(st.st_size));
                    json_object_set_new(mp4, "name", json_string(file->d_name));
                    json_array_append_new(arr, mp4);
                }

            buffer_appends(&ta->resp_body, json_dumps(arr, JSON_INDENT(1)));
            http_add_header(&ta->resp_headers, "Content-Type", "%s", "application/json");
            http_add_header(&ta->resp_headers, "Accept-Ranges", "%s", "bytes");
        }
        return send_response(ta);
    }
    else
        return send_error(ta, HTTP_NOT_FOUND, "api");

    success = send_response_header(ta) && send_response(ta);

    return success;
}

/* Set up an http client, associating it with a bufio buffer. */
void http_setup_client(struct http_client *self, struct bufio *bufio)
{
    self->bufio = bufio;
}

/* Handle a single HTTP transaction.  Returns true on success. */
bool http_handle_transaction(struct http_client *self)
{
    struct http_transaction ta;
    memset(&ta, 0, sizeof ta);
    ta.client = self;

    if (!http_parse_request(&ta))
        return false;

    if (!http_process_headers(&ta))
        return false;

    if (ta.req_content_len > 0)
    {
        int rc = bufio_read(self->bufio, ta.req_content_len, &ta.req_body);
        if (rc != ta.req_content_len)
            return false;

        // To see the body, use this:
        // char *body = bufio_offset2ptr(ta.client->bufio, ta.req_body);
        // hexdump(body, ta.req_content_len);
    }

    buffer_init(&ta.resp_headers, 1024);
    http_add_header(&ta.resp_headers, "Server", "CS3214-Personal-Server");
    buffer_init(&ta.resp_body, 0);

    bool rc = false;
    char *req_path = bufio_offset2ptr(ta.client->bufio, ta.req_path);

    // reject ../ attack
    if (strstr(req_path, ".."))
        return send_error(&ta, HTTP_NOT_FOUND, "../") && (ta.req_version == HTTP_1_1);

    if (STARTS_WITH(req_path, "/api"))
        rc = handle_api(&ta);
    else if (STARTS_WITH(req_path, "/private"))
    {
        char *cookie = ta.cookie;
        // decode the token
        if (cookie)
        {
            jwt_t *token;
            jwt_decode(&token, cookie, NULL, 0);
            int exp = jwt_get_grant_int(token, "exp");
            if (exp > time(NULL))
                rc = handle_static_asset(&ta, server_root);
            else
                return send_error(&ta, HTTP_PERMISSION_DENIED, "Permission denied.") && (ta.req_version == HTTP_1_1);
        }
        else
            return send_error(&ta, HTTP_PERMISSION_DENIED, "Permission denied.") && (ta.req_version == HTTP_1_1);
    }
    else
        rc = handle_static_asset(&ta, server_root);

    buffer_delete(&ta.resp_headers);
    buffer_delete(&ta.resp_body);

    return rc && (ta.req_version == HTTP_1_1);
}
