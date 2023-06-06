import nasa from './nasa';
import { MovieSchema, ShowSchema, TestTableShema, OtherSchema, CategorySchema} from './schemas';


const tableSchemas = {
    movies: MovieSchema,
    shows: ShowSchema,
    others: OtherSchema,
    categories: CategorySchema,
    test: TestTableShema,
}


const db:any = new nasa(tableSchemas);

export default db;