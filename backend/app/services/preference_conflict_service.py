from __future__ import annotations


def assert_preference_version(current_version: int, provided_version: int | None) -> None:
    if provided_version is None:
        return
    if provided_version != current_version:
        raise ValueError("preference_conflict")
