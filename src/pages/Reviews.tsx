import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import StarRating from '../components/StarRating';
import { Review } from '../types';

const Reviews: React.FC = () => {
  const { state, dispatch } = useApp();
  const [newReview, setNewReview] = useState({
    customerName: '',
    rating: 0,
    comment: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const averageRating = state.reviews.length > 0 
    ? state.reviews.reduce((sum, review) => sum + review.rating, 0) / state.reviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = state.reviews.filter(review => review.rating === rating).length;
    const percentage = state.reviews.length > 0 ? (count / state.reviews.length) * 100 : 0;
    return { rating, count, percentage };
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newReview.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    }

    if (newReview.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    if (!newReview.comment.trim()) {
      newErrors.comment = 'Please write a review';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const review: Review = {
        id: `rev-${Date.now()}`,
        ...newReview,
        date: new Date().toISOString().split('T')[0],
      };

      dispatch({ type: 'ADD_REVIEW', payload: review });

      // Show success message
      const event = new CustomEvent('showAlert', {
        detail: { message: 'Thank you for your review!', type: 'success' }
      });
      window.dispatchEvent(event);

      // Reset form
      setNewReview({ customerName: '', rating: 0, comment: '' });

    } catch (error) {
      const event = new CustomEvent('showAlert', {
        detail: { message: 'Failed to submit review. Please try again.', type: 'error' }
      });
      window.dispatchEvent(event);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRatingChange = (rating: number) => {
    setNewReview(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Customer Reviews
          </h1>
          <p className="text-xl text-gray-600">
            See what our customers are saying about their experience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Review Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <StarRating rating={Math.round(averageRating)} readOnly size="lg" />
                <p className="text-gray-600 mt-2">
                  Based on {state.reviews.length} review{state.reviews.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="space-y-2 mb-6">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center">
                    <span className="text-sm w-8">{rating}★</span>
                    <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm w-8 text-gray-600">{count}</span>
                  </div>
                ))}
              </div>

              {/* Write a Review Form */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={newReview.customerName}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200 ${
                        errors.customerName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your name"
                    />
                    {errors.customerName && (
                      <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating *
                    </label>
                    <div className="mb-2">
                      <StarRating 
                        rating={newReview.rating} 
                        onRatingChange={handleRatingChange} 
                        size="lg"
                      />
                    </div>
                    {errors.rating && (
                      <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Review *
                    </label>
                    <textarea
                      name="comment"
                      value={newReview.comment}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200 resize-none ${
                        errors.comment ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Tell us about your experience..."
                    />
                    {errors.comment && (
                      <p className="mt-1 text-sm text-red-600">{errors.comment}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-orange-600 hover:bg-orange-700 transform hover:scale-105'
                    } text-white`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {state.reviews.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <p className="text-xl text-gray-500">No reviews yet.</p>
                  <p className="text-gray-400">Be the first to share your experience!</p>
                </div>
              ) : (
                state.reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{review.customerName}</h4>
                        <StarRating rating={review.rating} readOnly />
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;