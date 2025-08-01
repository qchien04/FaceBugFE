import axiosClient from '../config/axiosconfig';

const TestApi = {
  kafka: async (): Promise<void> => {
    const { data } = await axiosClient.get("/public");
    return data;
  },

 

};

export default TestApi;