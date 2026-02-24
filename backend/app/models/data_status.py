from enum import Enum

from pydantic import BaseModel


class DataStatus(str, Enum):
    NORMAL = "NORMAL"
    DELAYED = "DELAYED"
    FAILED = "FAILED"


class DataStatusPayload(BaseModel):
    status: DataStatus
    message: str
    updatedAt: str
