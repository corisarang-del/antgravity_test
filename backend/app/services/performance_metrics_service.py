from __future__ import annotations


def aggregate_performance_metrics(records: list[dict[str, float]]) -> dict[str, float]:
    if not records:
        return {"da": 0.0, "mape": 0.0, "rmse": 0.0}

    da = sum(item["da"] for item in records) / len(records)
    mape = sum(item["mape"] for item in records) / len(records)
    rmse = sum(item["rmse"] for item in records) / len(records)
    return {"da": round(da, 4), "mape": round(mape, 4), "rmse": round(rmse, 4)}
