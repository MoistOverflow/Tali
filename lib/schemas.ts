import { z } from 'zod';

export const preSubmitMovieSchema = z.object({
    title: z.string().min(1).max(255),
    watched: z.boolean(),
    rating: z.number().min(0).max(5),
    notes: z.string().min(0).max(255),
}).strict();
export type PreSubmitMovie = z.infer<typeof preSubmitMovieSchema>;

export const MovieSchema = z.object({
    id: z.number(),
    title: z.string(),
    watched: z.boolean().default(false),
    rating: z.number().min(0).max(5).default(0),
    notes: z.string().default(''),
}).strict();
export type Movie = z.infer<typeof MovieSchema>;

export const MoviesSchema = z.array(MovieSchema);
export type Movies = z.infer<typeof MoviesSchema>;

export const PreSubmitShowSchema = z.object({
    title: z.string().min(1).max(255),
    //watchState unwatched = 0 | watching = 1 | watched = 2
    watchState: z.number().min(0).max(2),
    rating: z.number().min(0).max(5),
    notes: z.string().min(0).max(255),
    currentSeason: z.number().min(0).max(1000),
    currentEpisode: z.number().min(0).max(1000),
}).strict();
export type PreSubmitShow = z.infer<typeof PreSubmitShowSchema>;

export const ShowSchema = z.object({
    id: z.number(),
    title: z.string().min(1).max(255),
    //watchState unwatched = 0 | watching = 1 | watched = 2
    watchState: z.number().min(0).max(2),
    rating: z.number().min(0).max(5),
    notes: z.string().min(0).max(255),
    currentSeason: z.number().min(0).max(1000),
    currentEpisode: z.number().min(0).max(1000),
}).strict();
export type Show = z.infer<typeof ShowSchema>;

export const ShowsSchema = z.array(ShowSchema);
export type Shows = z.infer<typeof ShowsSchema>;

export const OtherSchema = z.object({
    id: z.number(),
    title: z.string(),
    //conpleteState TBD = 0 | In Progress = 1 | Completed = 2
    completeState: z.number().min(0).max(2),
    rating: z.number().min(0).max(5).default(0),
    notes: z.string().optional(),
    currentSeason: z.number().min(0).max(1000).default(0),
    currentEpisode: z.number().min(0).max(1000).default(0),
    category: z.number(),
}).strict();
export type Other = z.infer<typeof OtherSchema>;

export const OthersSchema = z.array(OtherSchema);
export type Others = z.infer<typeof OthersSchema>;

export const CategorySchema = z.object({
    id: z.number(),
    title: z.string(),
    showEpisodes: z.boolean().default(false),
}).strict();
export type Category = z.infer<typeof CategorySchema>;

export const CategoriesSchema = z.array(CategorySchema);
export type Categories = z.infer<typeof CategoriesSchema>;


export const TestTableShema = z.object({
    id: z.number(),
    test: z.string(),
}).strict();
export type TestTable = z.infer<typeof TestTableShema>;
