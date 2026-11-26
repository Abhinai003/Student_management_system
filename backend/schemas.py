from pydantic import BaseModel, EmailStr


class StudentCreate(BaseModel):
    name: str
    email: EmailStr
    mobile: str
    course: str


class StudentResponse(StudentCreate):
    id: int

    class Config:
        from_attributes = True