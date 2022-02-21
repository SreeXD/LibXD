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

export const displayLocalDate = (date: Date) => {
    var localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);

    return `${localDate.getUTCDate()} ${months[localDate.getUTCMonth()]} ${localDate.getUTCFullYear()}`
}

export const dateWithoutTime = (date: Date) => {
    var newDate = new Date(date)
    newDate.setHours(0, 0, 0, 0)

    return newDate
}