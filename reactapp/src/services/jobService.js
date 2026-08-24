    import api from './api'; // Import your pre-configured Axios instance

    export const jobService = {
        // Fetch all job posts
        getAllJobs: async () => {
            const response = await api.get('/jobs');
            return response.data;
        },

        // Fetch a single job post by ID
        getJobById: async (id) => {
            const response = await api.get(`/jobs/${id}`);
            return response.data;
        },

        // Create a new job post
        createJob: async (jobData) => {
            const response = await api.post('/jobs', jobData);
            return response.data;
        },

        // Update an existing job post
        updateJob: async (id, jobData) => {
            const response = await api.put(`/jobs/${id}`, jobData);
            return response.data;
        },

        // Delete a job post
        deleteJob: async (id) => {
            const response = await api.delete(`/jobs/${id}`);
            return response.data;
        }
    };