import api from './api'; // Pre-configured Axios instance

export const interviewService = {
    // Get ALL interviews -> GET /api/interviews
    getAllInterviews: async () => {
        const response = await api.get('/interviews');
        return response.data;
    },

    // Schedule a new interview -> POST /api/interviews
    scheduleInterview: async (formData) => {
        const response = await api.post('/interviews', formData);
        return response.data;
    },

    // Get interview by ID -> GET /api/interviews/{id}
    getInterviewById: async (id) => {
        const response = await api.get(`/interviews/${id}`);
        return response.data;
    },

    // Update interview details -> PUT /api/interviews/{id}
    updateInterview: async (id, formData) => {
        const response = await api.put(`/interviews/${id}`, formData);
        return response.data;
    },

    // Cancel an interview -> DELETE /api/interviews/{id}/cancel
    cancelInterview: async (id) => {
        const response = await api.delete(`/interviews/${id}/cancel`);
        return response.data;
    },

    // Reschedule an interview -> PATCH /api/interviews/{id}/reschedule
    rescheduleInterview: async (id, date, time) => {
        const response = await api.patch(`/interviews/${id}/reschedule`, null, {
            params: { date, time }
        });
        return response.data;
    },

    // Submit feedback -> POST /api/feedback
    // interviewId is embedded inside feedbackData (as per InterviewFeedbackRequest DTO)
    submitFeedback: async (interviewId, feedbackData) => {
        const response = await api.post('/feedback', { ...feedbackData, interviewId });
        return response.data;
    },

    // Get feedback by interview ID -> GET /api/feedback/interview/{interviewId}
    getFeedbackByInterview: async (interviewId) => {
        const response = await api.get(`/feedback/interview/${interviewId}`);
        return response.data;
    }
};