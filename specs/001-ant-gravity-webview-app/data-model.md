# Data Model - Ant Gravity AI 주가 예측 웹앱

## 1. User
- Fields:
  - id (UUID, PK)
  - email (string, unique)
  - displayName (string, 1..40)
  - levelScore (integer, >=0)
  - isPaidSubscriber (boolean)
  - createdAt (datetime)
  - updatedAt (datetime)
- Validation:
  - email unique 필수
  - levelScore 음수 금지
- Relationships:
  - 1:N WatchlistItem
  - 1:N AlertPreference
  - 1:N AppNotification

## 2. Symbol
- Fields:
  - id (UUID, PK)
  - ticker (string, unique)
  - market (string)
  - displayName (string)
  - isActive (boolean)
  - createdAt (datetime)
- Validation:
  - ticker+market 조합 유일
- Relationships:
  - 1:N Prediction
  - 1:N IndicatorSnapshot
  - 1:N WatchlistItem

## 3. Prediction
- Fields:
  - id (UUID, PK)
  - symbolId (FK -> Symbol)
  - horizonDate (date)
  - predictedPrice (number)
  - direction (enum: UP | DOWN | FLAT)
  - confidenceScore (number, 0..1)
  - generatedAt (datetime)
  - dataStatus (enum: NORMAL | DELAYED | FAILED)
- Validation:
  - (symbolId, horizonDate, generatedAt-version) 중복 금지
- State transitions:
  - NORMAL -> DELAYED 가능
  - DELAYED -> NORMAL 복귀 가능
  - FAILED는 생성 실패 기록용

## 4. IndicatorSnapshot
- Fields:
  - id (UUID, PK)
  - symbolId (FK -> Symbol)
  - snapshotAt (datetime)
  - closePrice (number)
  - volume (number)
  - vix (number)
  - fearGreedIndex (number, 0..100)
  - rsi14 (number)
  - macd (number)
- Validation:
  - symbolId+snapshotAt unique

## 5. PerformanceRecord
- Fields:
  - id (UUID, PK)
  - modelVersion (string)
  - periodStart (date)
  - periodEnd (date)
  - da (number, 0..1)
  - mape (number, >=0)
  - rmse (number, >=0)
  - generatedAt (datetime)
- Validation:
  - periodStart < periodEnd

## 6. WatchlistItem
- Fields:
  - id (UUID, PK)
  - userId (FK -> User)
  - symbolId (FK -> Symbol)
  - createdAt (datetime)
- Validation:
  - userId+symbolId unique
- State transitions:
  - ACTIVE(기본) / REMOVED(소프트삭제 선택 가능)

## 7. AlertPreference
- Fields:
  - id (UUID, PK)
  - userId (FK -> User)
  - symbolId (FK -> Symbol)
  - isEnabled (boolean)
  - thresholdType (enum: PRICE_CHANGE | CONFIDENCE_DROP | DIRECTION_CHANGE)
  - thresholdValue (number)
  - updatedAt (datetime)
- Validation:
  - userId+symbolId unique

## 8. AppNotification
- Fields:
  - id (UUID, PK)
  - userId (FK -> User)
  - symbolId (FK -> Symbol, nullable)
  - message (string, <=300)
  - notificationDate (date)
  - isRead (boolean)
  - createdAt (datetime)
  - readAt (datetime, nullable)
- Validation:
  - 동일 userId+symbolId+notificationDate+message 중복 발송 금지
- State transitions:
  - UNREAD -> READ

## 데이터 볼륨/스케일 가정
- Symbol: 수백 ~ 수천
- Prediction/IndicatorSnapshot: 종목 수 x 일자/주기 기준으로 빠르게 증가하므로 파티셔닝 고려
- AppNotification: 사용자 활성도에 비례해 급증 가능, 최근 N일 조회 인덱스 필수
