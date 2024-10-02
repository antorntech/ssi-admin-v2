import { Input, Textarea, Typography } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditFaq = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    // Retrieve the specific review from local storage
    const storedFaqs = JSON.parse(localStorage.getItem("faqsData")) || [];
    const faqToEdit = storedFaqs.find((faq) => faq.id === parseInt(id));

    if (faqToEdit) {
      setQuestion(faqToEdit.question);
      setAnswer(faqToEdit.answer);
    } else {
      toast.error("Faq not found", {
        position: "top-right",
        hideProgressBar: false,
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/faqs");
    }
  }, [id, navigate]);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };
  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("question", question);
    formData.append("answer", answer);

    console.log(question, answer);

    try {
      //   const response = await fetch("/api/upload", {
      //     method: "POST",
      //     body: formData,
      //     headers: {
      //       "X-Requested-With": "XMLHttpRequest",
      //     },
      //     onUploadProgress: (event) => {
      //       setUploadProgress(Math.round((event.loaded * 100) / event.total));
      //     },
      //   });

      //   if (!response.ok) {
      //     throw new Error("Upload failed");
      //   }

      //   const result = await response.json();
      //   console.log("Upload successful", result);

      // Retrieve existing data from local storage
      const storedFaqs = JSON.parse(localStorage.getItem("faqsData")) || [];
      const updatedFaqs = storedFaqs.map((faq) =>
        faq.id === parseInt(id)
          ? {
              ...faq,
              question,
              answer,
            }
          : faq
      );

      localStorage.setItem("faqsData", JSON.stringify(updatedFaqs));

      toast.success("Faq updated successfully", {
        position: "top-right",
        hideProgressBar: false,
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      navigate("/faqs");

      // Reset the form
      setQuestion("");
      setAnswer("");
    } catch (error) {
      console.error("Error uploading file", error);
      // Reset the form
      setQuestion("");
      setAnswer("");
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-xl font-bold">Add Faq</h1>
        <p className="text-sm text-gray-500">
          You can add faq details from here.
        </p>
      </div>
      <div className="mt-5 w-full md:flex">
        <div className="w-full md:w-1/2 flex flex-col">
          <div>
            <Typography variant="h6" color="gray" className="mb-1 font-normal">
              Question
            </Typography>
            <Input
              type="text"
              size="lg"
              placeholder="Enter faq question"
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:!border-t-border-[#199bff] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={question}
              name="question"
              onChange={handleQuestionChange}
            />
          </div>

          <div>
            <Typography
              variant="h6"
              color="gray"
              className="mb-1 font-normal mt-2"
            >
              Answer
            </Typography>
            <Textarea
              value={answer}
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#199bff] focus:!border-t-border-[#199bff] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              onChange={handleAnswerChange}
              rows={5}
              placeholder="Enter faq answer"
            />
          </div>
          <button
            onClick={handleUpdate}
            className="mt-5 bg-[#199bff] text-white px-4 py-2 rounded"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFaq;
