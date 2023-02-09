export enum Code {
    /**
     ** default success response
     */
    success = '200',
    /**
     ** resource created!
     */
    created = '201',
    /**
     *! resource not found!
     */
    notFound = '404',
    /**
     *! method is not allowed!
     */
    notAllowed = '405',
    /**
     *! client not authorized!
     */
    unAuthorized = '401',
    /**
     *! resource not allowed!
     */
    forbidden = '403',
    /**
     *! unprocessable Entity!
     */
    unProcessable = '422',
    /**
     *! internal server error!
     */
    serverError = '500'
}