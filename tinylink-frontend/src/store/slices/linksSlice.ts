import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Link, CreateLinkRequest, LinkStats, CreateLinkResponse } from "@/types/link";
import { api } from "@/services/api";

interface LinksState {
  links: Link[];
  currentLink: LinkStats | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: LinksState = {
  links: [],
  currentLink: null,
  loading: false,
  error: null,
  searchQuery: "",
};

// Async thunks
export const fetchLinks = createAsyncThunk("links/fetchLinks", async () => {
  return await api.getLinks();
});

export const fetchLinkByCode = createAsyncThunk(
  "links/fetchLinkByCode",
  async (code: string) => {
    return await api.getLinkByCode(code);
  }
);

// export const createLink = createAsyncThunk(
//   "links/createLink",
//   async (data: CreateLinkRequest) => {
//     return await api.createLink(data);
//   }
// );


// export const createLink = createAsyncThunk(
//   "links/createLink",
//   async (data: CreateLinkRequest) => {
//     const res = await api.createLink(data);

//     // Map BACKEND → FRONTEND fields
//     return {
//       id: res.code,                      // backend does not send unique id
//       code: res.code,
//       targetUrl: res.url,
//       clicks: res.total_clicks,
//       lastClicked: res.last_clicked,
//       createdAt: res.created_at,
//       expiresAt: res.expiry_date ?? null,
//     } as Link;
//   }
// );



export const createLink = createAsyncThunk<CreateLinkResponse, CreateLinkRequest>(
  "links/createLink",
  async (data: CreateLinkRequest) => {
    return await api.createLink(data);
  }
);


export const deleteLink = createAsyncThunk(
  "links/deleteLink",
  async (code: string) => {
    await api.deleteLink(code);
    return code;
  }
);

const linksSlice = createSlice({
  name: "links",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all links
    builder
      .addCase(fetchLinks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLinks.fulfilled, (state, action) => {
        state.loading = false;
        state.links = action.payload;
      })
      .addCase(fetchLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch links";
      });

    // Fetch link by code
    builder
      .addCase(fetchLinkByCode.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentLink = null;
      })
      .addCase(fetchLinkByCode.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLink = action.payload;
      })
      .addCase(fetchLinkByCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch link";
      });

    // Create link
    builder
      .addCase(createLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLink.fulfilled, (state, action) => {
        state.loading = false;
        state.links.unshift(action.payload.link);
      })
      .addCase(createLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create link";
      });

    // Delete link
    builder
      .addCase(deleteLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLink.fulfilled, (state, action) => {
        state.loading = false;
        state.links = state.links.filter((link) => link.code !== action.payload);
      })
      .addCase(deleteLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete link";
      });
  },
});

export const { setSearchQuery, clearError } = linksSlice.actions;
export default linksSlice.reducer;
