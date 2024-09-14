import axiosClient from "./axiosClient"

export const translateToSignApi =  {
  generateVideo: async (body: any) => {
    const url = "/generate";
    const response = await axiosClient.post(url, body, {
      responseType: "arraybuffer"
    });

    if (response.status === 200) {
      return response;
    }

    return Promise.reject(response.status)
  },

  generateAslVideo: async (body: any) => {
    const url = "/generate-asl";
    const response = await axiosClient.post(url, body, {
      responseType: "arraybuffer"
    });

    if (response.status === 200) {
      return response;
    }

    return Promise.reject(response.status)
  },

  uploadSignVideo: async (body: FormData) => {
    console.log(body)
    const url = "/upload";
    const response = await axiosClient.post(url, body)

    return response;
  },
  uploadNormalVideo: async (body: FormData) => {
    console.log(body)
    const url = "/upload-normal-video";
    const response = await axiosClient.post(url, body)

    return response;
  }
}