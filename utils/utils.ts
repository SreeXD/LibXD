import jwt from 'jsonwebtoken'

export const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
]

export const verifyToken = (token: string) => {
    try {
        jwt.verify(token, process.env.JWT_SECRET ?? '')
    }

    catch (error) {
        return false;
    }

    return true;
}

export const formatDate = (date: string) => {
    const dateSplit = date.split('-')
    const year = dateSplit[0]
    const month = dateSplit[1]
    const day = dateSplit[2].substr(0, 2)

    const monthIndex = +month - 1

    return `${day} ${months[monthIndex]} ${year}`
}

export const convertUTCDateToLocalDate = (date: Date) => {
    var localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    
    return localDate;   
}

export const clearTimeFromDate = (date: Date) => {
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
}

export const stringToDate = (sDate: string) => {
    const sArr = sDate.substr(0, 10).split('-')
    const date = new Date(+sArr[0], +sArr[1]-1, +sArr[2], 0, 0, 0, 0)

    return date 
}