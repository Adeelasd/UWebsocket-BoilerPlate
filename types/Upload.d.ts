export interface IFormData {
    data: {
        [key: string]: any
    },
    files: {
        [key: string]: {
            path?: string,
            type?: string,
            name?: string
        }
    }
}