import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { api_url } from "../../utils/utils";

export const blogAdd = createAsyncThunk(
  "blog/blogAdd",
  async (
    { title, content, image, metaTitle, metaDescription },
    { rejectWithValue, fulfillWithValue, getState }
  ) => {
    const token = getState().auth.token; // Assumes you have token stored in Redux state
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("image", image);
      formData.append("metaTitle", metaTitle); // Added Meta Title
      formData.append("metaDescription", metaDescription); // Added Meta Description
      const { data } = await axios.post(
        `${api_url}/api/blog/blog-add`,
        formData,
        config
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const blogEdit = createAsyncThunk(
  "blog/blogEdit",
  async (
    { id, name, image },
    { rejectWithValue, fulfillWithValue, getState }
  ) => {
    console.log(id);
    const token = getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("name", name);
      if (image) formData.append("image", image); // Only append image if it's provided

      const { data } = await axios.put(
        `${api_url}/api/category-edit/${id}`,
        formData,
        config
      );

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const delete_blog = createAsyncThunk(
  "blog/delete_blog",
  async (id, { rejectWithValue, fulfillWithValue, getState }) => {
    console.log(id, "id");
    const token = getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.delete(
        `${api_url}/api/blog/delete-blog/${id}`,
        config
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const get_blog = createAsyncThunk(
  "blog/get_blog",
  async (blogId, { rejectWithValue, fulfillWithValue, getState }) => {
    console.log(blogId, "id");
    const token = getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.get(
        `${api_url}/api/blog/get-blog/${blogId}`,
        config
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const get_blogs = createAsyncThunk(
  "blog/get_blogs",
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue, getState }
  ) => {
    const token = getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.get(
        `${api_url}/api/blog/blog-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
        config
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const update_Blog = createAsyncThunk(
  "blog/update_Blog",
  async (blog, { rejectWithValue, fulfillWithValue, getState }) => {
    const token = getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.post(
        `${api_url}/api/blog/blog-update`,
        blog,
        config
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const blog_image_update = createAsyncThunk(
  "blog/blog_image_update",
  async (
    { oldImage, newImage, blogId },
    { rejectWithValue, fulfillWithValue, getState }
  ) => {
    const token = getState().auth.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const formData = new FormData();
      formData.append("oldImage", oldImage);
      formData.append("newImage", newImage);
      formData.append("blogId", blogId);
      const { data } = await axios.post(
        `${api_url}/api/blog/blog-image-update`,
        formData,
        config
      );
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error)
      return rejectWithValue(error.response.data);
    }
  }
);
export const blogReducer = createSlice({
  name: "blog",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    blogs: [],
    totalBlog: 0,
    blog: "",
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: {
    [blogAdd.pending]: (state, _) => {
      state.loader = true;
    },
    [blogAdd.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [blogAdd.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.blogs = [...state.blogs, payload.blog];
    },
    [get_blog.pending]: (state, _) => {
      state.loader = true;
    },
    [get_blog.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [get_blog.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.blog = payload.blog;
    },
    [update_Blog.pending]: (state, _) => {
      state.loader = true;
    },
    [update_Blog.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [update_Blog.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.blog = payload.blog;
      state.successMessage = payload.message;
    },
    [blogEdit.pending]: (state, _) => {
      state.loader = true;
    },
    [blogEdit.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [blogEdit.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
    },
    [delete_blog.pending]: (state, _) => {
      state.loader = true;
    },
    [delete_blog.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [delete_blog.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
    },
    [get_blogs.fulfilled]: (state, { payload }) => {
      state.totalBlog = payload.totalBlog;
      state.blogs = payload.blogs;
    },
    [blog_image_update.fulfilled]: (state, { payload }) => {
      state.blog = payload.blog;
      state.successMessage = payload.message;
    },
  },
});
export const { messageClear } = blogReducer.actions;
export default blogReducer.reducer;
