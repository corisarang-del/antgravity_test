from pydantic import BaseModel, Field


class RefreshPolicy(BaseModel):
    tier: str
    refreshSeconds: int = Field(gt=0)
    label: str


class EligibilityReason(BaseModel):
    hasActiveSubscription: bool
    levelScore: int = Field(ge=0)


def resolve_refresh_policy(has_active_subscription: bool, level_score: int) -> tuple[RefreshPolicy, EligibilityReason]:
    is_realtime = has_active_subscription or level_score >= 70
    policy = RefreshPolicy(
        tier="premium" if is_realtime else "basic",
        refreshSeconds=60 if is_realtime else 900,
        label="1m realtime" if is_realtime else "15m intraday + 1 close",
    )
    reason = EligibilityReason(hasActiveSubscription=has_active_subscription, levelScore=level_score)
    return policy, reason

