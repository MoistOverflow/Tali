import AsyncStorage from '@react-native-async-storage/async-storage';

export default class nasa{
    #tableName = '';
    data:any = [];
    #selectedFields: any[] = []
    error = '';
    #mode = ''
    #pushData: any = {}
    #tableSchemas: any = {}

    constructor(tableSchemas: any){
        this.#tableSchemas = tableSchemas;
    }

    from(tableName:string){
        this.#tableName = tableName;
        this.error = '';
        this.data = [];
        return this;
    }

    select(...fields:string[]){
        this.#selectedFields = fields;
        this.#mode = 'select';
        return this;
    }

    async insert(newData:any){
        let table:any = await AsyncStorage.getItem(this.#tableName);
        if(table){
            table = JSON.parse(table);
            let maxId = 0;
            table.forEach((s:any)=>{
                if(s.id > maxId){
                    maxId = s.id;
                }
            });
            newData.id = maxId + 1;
            const {data, error} = await this.#tableSchemas[this.#tableName].safeParse(newData);
            if(error){
                this.error = error.message;
                return this;
            }
            table.push(data);
            await AsyncStorage.setItem(this.#tableName, JSON.stringify(table));
            this.data = data
            return this;
        }else{
            newData.id = 1;
            const {data, error} = await this.#tableSchemas[this.#tableName].safeParse(newData);
            if(error){
                this.error = error.message;
                return this;
            }
            await AsyncStorage.setItem(this.#tableName, JSON.stringify([data]));
            this.data = data
            return this;
        }
    }
    
    update(data:any){
        this.#pushData = data;
        this.#mode = 'update';
        return this;
    }

    delete(){
        this.#mode = 'delete';
        return this;
    }

    async eq(filters:any = {}){
        if (this.#mode === 'select'){
            return await this.realSelect(filters);
        }else if (this.#mode === 'update'){
            return await this.realUpdate(filters);
        }else if (this.#mode === 'delete'){
            return await this.realDelete(filters);
        }
    }

    async realSelect(filters: any){
        const data = await AsyncStorage.getItem(this.#tableName);
        if(data){
            this.data = JSON.parse(data);
        }
        if(this.data.length === 0){
            return this;
        }
        this.data = this.data.filter((row:any)=>{
            let match = true;
            for(let key in filters){
                if(row[key] !== filters[key]){
                    match = false;
                }
            }
            return match;
        });
            if (this.#selectedFields.length > 0){
                this.data = this.data.map((row:any)=>{
                    let newRow:any = {};
                    this.#selectedFields.forEach((field)=>{
                        newRow[field] = row[field];
                    });
                    return newRow;
                });
            }
        return this;
    }

    async realUpdate(where:any){
        const data = await AsyncStorage.getItem(this.#tableName);
        if(data){
            this.data = JSON.parse(data);
        }
        if(this.data.length === 0){
            return this;
        }
        let newData: any = []
        let returnData: any = []
        for (let row in this.data){
            let match = true;
            for(let key in where){
                if(this.data[row][key] !== where[key]){
                    match = false;
                }
            }
            if(match){
                const toPush = {...this.data[row], ...this.#pushData};
                const {data, error} = await this.#tableSchemas[this.#tableName].safeParse(toPush);
                if(error){
                    this.error = error.message;
                    return this;
                }
                newData.push(data);
                returnData.push(data);
            }else{
                newData.push(this.data[row]);
            }
        }
        this.data = newData;
        await AsyncStorage.setItem(this.#tableName, JSON.stringify(this.data));
        this.data = returnData;
        return this;
    }

    async realDelete(where:any){
        const data = await AsyncStorage.getItem(this.#tableName);
        if(!data){
            this.error = 'Table empty';
            return this;
        }
        this.data = JSON.parse(data);
        if(this.data.length === 0){
            return this;
        }
        const newData: any = []
        const returnData: any = []
        this.data.forEach((row:any)=>{
            let match = true;
            for(let key in where){
                if(row[key] !== where[key]){
                    match = false;
                }
            }
            if(match){
                returnData.push(row);
            }else{
                newData.push(row);
            }
        });
        this.data = newData;
        await AsyncStorage.setItem(this.#tableName, JSON.stringify(this.data));
        this.data = returnData;
        if (returnData.length === 0){
            this.error = 'No match found';
        }
        return this;
    }
    
}