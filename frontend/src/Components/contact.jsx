import React, { useState } from "react";
import { Send, Cloud, CheckCircle2, AlertTriangle } from "lucide-react";
import contactFormSchema from "@/lib/schemas/contactFormSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";

const Contact = () => {
  const [status, setStatus] = useState(null);

  const {
    register,
    formState: { errors, isSubmitting },
    reset,
    handleSubmit,
    setError,
  } = useForm({ resolver: zodResolver(contactFormSchema) });

  const onSubmit = async (values) => {
    const { name, email, message } = values;
    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        body: JSON.stringify({ name, email, message }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        reset();
        setStatus("success");
      } else {
        setStatus("error");
        setError("root", {
          message: "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      setStatus("error");
      setError("root", { message: "Something went wrong. Please try again." });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 font-inter"
      style={{ backgroundColor: "rgb(217,228,236)" }}
    >
      <style>
        {`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        @keyframes drift {
          0% { transform: translateX(0); opacity: 0.8; }
          50% { transform: translateX(8px); opacity: 0.7; }
          100% { transform: translateX(0); opacity: 0.8; }
        }
        .animate-float-icon {
          animation: float 3s ease-in-out infinite;
        }
        .animate-drift-1 { animation: drift 10s ease-in-out infinite; }
        .animate-drift-2 { animation: drift 12s ease-in-out infinite reverse; }
        .animate-drift-3 { animation: drift 8s ease-in-out infinite; }
        .animate-drift-4 { animation: drift 11s ease-in-out infinite reverse; }
        .animate-drift-5 { animation: drift 9s ease-in-out infinite; }
        `}
      </style>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative  bg-[#101e35] border border-[#1c2e4a]   text-white rounded-xl shadow-lg p-8 md:p-10 w-full max-w-lg flex flex-col items-center overflow-hidden"
      >
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <Send className="w-10 h-10 text-blue-400 animate-float-icon" />
          <Cloud
            className="text-blue-50 w-8 h-8 animate-drift-1"
            style={{ opacity: "0.6", filter: "blur(0.5px)" }}
          />
        </div>
        <div className="absolute bottom-4 left-4 flex items-center space-x-2">
          <Cloud
            className="text-blue-50 w-6 h-6 animate-drift-2"
            style={{ opacity: "0.5", filter: "blur(0.3px)" }}
          />
          <Cloud
            className="text-blue-50 w-9 h-9 animate-drift-3"
            style={{ opacity: "0.7", filter: "blur(0.7px)" }}
          />
        </div>
        <div className="absolute top-1/2 left-2 transform -translate-y-1/2">
          <Cloud
            className="text-blue-50 w-7 h-7 animate-drift-4"
            style={{ opacity: "0.6", filter: "blur(0.4px)" }}
          />
        </div>
        <div className="absolute bottom-1/4 right-2 transform translate-y-1/2">
          <Cloud
            className="text-blue-50 w-9 h-9 animate-drift-5"
            style={{ opacity: "0.8", filter: "blur(0.6px)" }}
          />
        </div>

        <div className="text-center w-full z-10">
          <AnimatePresence mode="wait">
            {!status && (
              <motion.form
                key="form"
                onSubmit={handleSubmit(onSubmit)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <h1 className="text-3xl font-bold text-blue-100 dark:text-neutral-100 mb-2">
                  Get in Touch
                </h1>
                <p className="text-blue-50 dark:text-neutral-300 mb-8">
                  We'd love to hear from you! Send us a message below.
                </p>

                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-blue-100 dark:text-neutral-100 mb-1 text-left"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register("name")}
                    className={`w-full px-4 py-2 border
                      placeholder:text-blue-50 placeholder:dark:text-neutral-300 ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-blue-300 focus:border-blue-500 transition`}
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 text-left">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-blue-100 dark:text-neutral-100 mb-1 text-left"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    className={`w-full px-4 py-2 border  placeholder:text-blue-50 placeholder:dark:text-neutral-300 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-blue-300 focus:border-blue-500 transition`}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 text-left">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-blue-100 dark:text-neutral-100 mb-1 text-left"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    {...register("message")}
                    rows="5"
                    className={`w-full px-4 py-2 border  placeholder:text-blue-50 placeholder:dark:text-neutral-300 ${
                      errors.message ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-blue-300 focus:border-blue-500 transition`}
                    placeholder="Type your message..."
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600 text-left">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-400 cursor-pointer transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
                <p className="text-blue-50 text-sm dark:text-neutral-300">
                  Alternatively, email us at{" "}
                  <a
                    href="mailto:info@example.com"
                    className="text-blue-400 hover:underline"
                  >
                    info@example.com
                  </a>
                </p>
              </motion.form>
            )}

            {status === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center py-16 space-y-4"
              >
                <CheckCircle2 className="w-16 h-16 text-green-400" />
                <h2 className="text-2xl font-bold text-gray-200">
                  Message Sent!
                </h2>
                <p className="text-gray-300 max-w-sm">
                  We’ve received your message and our team will get back to you
                  shortly. Thank you for reaching out 🙌
                </p>
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center py-16 space-y-4"
              >
                <AlertTriangle className="w-16 h-16 text-red-400" />
                <h2 className="text-2xl font-bold text-blue-100 dark:text-neutral-100">
                  Something went wrong
                </h2>
                <p className="text-blue-50 dark:text-neutral-300 max-w-sm">
                  We couldn’t send your message right now. Please try again
                  later or email us at{" "}
                  <a
                    href="mailto:info@example.com"
                    className="text-blue-400 hover:underline"
                  >
                    info@example.com
                  </a>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
