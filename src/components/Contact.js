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
      <div className="container mx-auto flex px-10 py-10 md:flex-row flex-col items-center">
        <p className="mb-8 text-gray-400 leading-relaxed">
          <a href="https://www.linkedin.com/in/preston-verling/" target="_blank" rel="noreferrer">
            <img alt="linkedin" className="socials" src="./socials_linkedin.svg"  />
          </a>
          <a href="https://discord.gg/cQe8EQ4UYP" target="_blank" rel="noreferrer">
            <img alt="discord" className="socials" src="./socials_discord.svg"  />
          </a>
          <a href="https://twitter.com/PrestonV78" target="_blank" rel="noreferrer">
            <img alt="twitter" className="socials" src="./socials_twitter.svg"  />
          </a>
          <a href="https://github.com/PrestonV78" target="_blank" rel="noreferrer">
            <img alt="github" className="socials" src="./socials_github.svg"  />
          </a>
        </p>
      </div>
      <div className="container mx-auto flex px-10 py-20 md:flex-row flex-col text-center items-center">
        <form
          netlify
          name="test"
          onSubmit={handleSubmit}
          className="lg:w md:w- flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0">
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
