import uuid

from fastapi.testclient import TestClient

from main import app
from app.store import notifications_by_user

client = TestClient(app)


def test_notification_read_transition() -> None:
    user_id = "test-user"
    notification_id = str(uuid.uuid4())
    notifications_by_user[user_id] = [
        {
            "id": notification_id,
            "symbol": "TSLA",
            "message": "test",
            "isRead": False,
            "createdAt": "2026-02-24T00:00:00Z",
            "readAt": None,
        }
    ]

    response = client.patch(
        f"/api/notifications/{notification_id}/read",
        headers={"x-user-id": user_id},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["isRead"] is True
    assert payload["readAt"] is not None
