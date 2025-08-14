"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface SurveyFormProps {
  appointmentId: string;
  clientName: string;
  petName: string;
  onSubmitted: () => void;
}

export default function SurveyForm({ appointmentId, clientName, petName, onSubmitted }: SurveyFormProps) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId,
          rating,
          feedback: feedback.trim() || undefined,
        }),
      });

      if (response.ok) {
        onSubmitted();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to submit survey");
      }
    } catch (error) {
      console.error("Survey submission error:", error);
      alert("Failed to submit survey");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">How was your visit?</h2>
        <p className="text-gray-600">
          We'd love to hear about {petName}'s grooming experience!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Rate your experience
          </label>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-1 transition-colors ${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                } hover:text-yellow-400`}
              >
                <Star size={32} fill={star <= rating ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-center text-sm text-gray-600 mt-2">
              {rating === 1 && "We're sorry to hear that. Please let us know how we can improve."}
              {rating === 2 && "We appreciate your feedback. How can we do better?"}
              {rating === 3 && "Thank you for your feedback. What could we improve?"}
              {rating === 4 && "Great! We're glad you had a good experience."}
              {rating === 5 && "Wonderful! We're thrilled you loved our service!"}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
            Additional feedback (optional)
          </label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Tell us more about your experience..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting || rating === 0}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>

      {rating >= 4 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">
            Since you had a great experience, we'll send you a link to leave a Google review!
          </p>
        </div>
      )}
    </div>
  );
}
