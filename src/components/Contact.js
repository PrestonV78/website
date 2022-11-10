import React from "react";

export default function Contact() {
  const [name, setName] = React.useState("");
  const [affiliation, setAffiliation] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  function encode(data) {
    return Object.keys(data)
      .map(
        (key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
      )
      .join("&");
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({ "form-name": "test", name, affiliation, email, message }),
    })
      .then(() => alert("Message sent!"))
      .catch((error) => alert(error));
  }

  return (
    <section id="contact" className="relative">
      <div className="container mx-auto flex px-10 py-20 md:flex-row flex-col text-center items-center">
      </div>
      <div className="container mx-auto flex px-10 py-20 md:flex-row flex-col text-center items-center">
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1 className="title-font sm:text-7xl text-3xl mb-4 font-HelloZone text-white">
            Socials
          </h1>
          <p className="mb-8 text-gray-400 leading-relaxed">
            LinkedIn<br></br>
            <img
            className="object-cover object-center rounded"
            alt="badge"
            src="./linkedin.svg"
            href="https://www.linkedin.com/in/preston-verling/"
            />
            Discord<br></br>
            <img
            className="object-cover object-center rounded"
            alt="badge"
            src="./Discord.svg"
            href="https://discord.gg/cQe8EQ4UYP"
            />
            Twitter<br></br>
            <img
            className="object-cover object-center rounded"
            alt="badge"
            src="./twitter.svg"
            href="https://twitter.com/PrestonV78"
            />
            GitHub<br></br>
            <img
            className="object-cover object-center rounded"
            alt="badge"
            src="./github.svg"
            href="https://github.com/PrestonV78"
            />
          </p>
        </div>
        <form
          netlify
          name="test"
          onSubmit={handleSubmit}
          className="lg:w-3/4 md:w-1/2 flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0">
          <h2 className="text-white sm:text-7xl text-3xl mb-1 font-HelloZone title-font text-center">
            Contact  Me
          </h2>
          <p className="leading-relaxed mb-5 text-center text-gray-400">
            Use the form below to contact me for any inquiries. All GitHub/GitLab access inquiries should be sent through this form. I will respond to all inquiries in a timely manner. Thank you!
          </p>
          <div className="relative mb-4 text-left">
            <label htmlFor="name" className="leading-7 text-sm text-white">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full bg-purple-900 rounded border border-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-900 text-base outline-none text-white py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="relative mb-4 text-left">
            <label htmlFor="affiliation" className="leading-7 text-sm text-white">
              Affiliation
            </label>
            <input
              type="text"
              id="affiliation"
              name="affiliation"
              className="w-full bg-purple-900 rounded border border-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-900 text-base outline-none text-white py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              onChange={(e) => setAffiliation(e.target.value)}
            />
          </div>
          <div className="relative mb-4 text-left">
            <label htmlFor="email" className="leading-7 text-sm text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full bg-purple-900 rounded border border-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-900 text-base outline-none text-white py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative mb-4 text-left">
            <label
              htmlFor="message"
              className="leading-7 text-sm text-white">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              className="w-full bg-purple-900 rounded border border-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-900 text-base outline-none text-white py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="text-white bg-purple-900 border-0 py-2 px-6 focus:outline-none hover:bg-purple-800 rounded text-lg">
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}
