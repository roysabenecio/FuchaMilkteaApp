export type LoginForm = {
    userName: string,
    password: string
}

export interface UserDTO {
    id: number,
    ["First Name"]: string,
    ["Last Name"]: string,
    ["User Status"]: string,
    ["Username"]: string,
    ["Role"]: string,
    dateCreated?: string,
    isRemoved?: boolean
}

export type RegisterForm = {
    userId: string,
    firstName: string,
    lastName: string,
    userName: string,
    password: string,
    confirmPassword: string,
    role: string,
}

export interface RegisterUser {
    userId: string,
    firstName: string,
    lastName: string,
    userName: string,
    password: string,
    confirmPassword?: string,
    role: string,
}

export interface UsersFCProps {
    existingUsers: UserDTO[],
    removedUsers:UserDTO[],
    usersInfo: UserDTO[],
}

export interface EditUserFormFCProps {
    currRow?: UserDTO,
    handleClose: () => void,
    onSubmitPut: (data?: EditUserFormInputs) => void
}

export interface AddUserFormFCProps {
    // currRow?: UserDTO,
    handleClose: () => void,
    onValidate: (data?:any) => void
}

export interface EditUserFormInputs {
    id: number,
    actorId: number,
    firstName: string,
    lastName: string,
    userName: string,
    userStatus: string,
    role: string,
}

