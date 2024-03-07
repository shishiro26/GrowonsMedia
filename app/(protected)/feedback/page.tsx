import React from "react";
import FeedbackForm from "../_components/feedback-form";

const FeedbackPage = () => {
  return (
    <section>
      <h1 className="text-3xl mt-4 ml-2">Feedback</h1>
      <div className="m-3">
        <div className="mt-4">
          <FeedbackForm />
        </div>
      </div>
    </section>
  );
};

export default FeedbackPage;
