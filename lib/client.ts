import nasa from './nasa';
import { MovieSchema, ShowSchema, TestTableShema, OtherSchema, CategorySchema, SettingSchema} from './schemas';


const tableSchemas = {
    movies: MovieSchema,
    shows: ShowSchema,
    others: OtherSchema,
    categories: CategorySchema,
    settings: SettingSchema ,
}


const db:any = new nasa(tableSchemas);

export default db;