


# 트랜잭션 병합 마이크로 서비스

## 구현 기능 목록

- [ ] Transaction을 수집할 수 있다.
  - [ ] API를 요청하여 Transaction을 수집할 수 있다.
    - [ ] 실패할 경우 재시도 데이터에 저장한다.
  - [x] CSV 파일에 접근하여 Transaction을 수집할 수 있다.
  - [x] 각 Transaction 수집을 동시에 병렬적으로 실행한다.
  - [x] 이미 처리한 Transaction의 경우 스킵한다.
  - [x] 수집 완료된 경우 DB에 저장한다.
  - [x] 중복 체크를 효율적으로 하기 위해서 key:value 형식으로도 저장한다.
- [x] Store Transaction 을 Transaction과 매칭시켜 조회한다.
  - [x] Store Transaction을 캐시하여 저장한다.
- [x] Transaction과 Store Transaction을 Merge하여 Merge Transaction을 생성한다.
- [x] 파일 데이터베이스에 저장할 수 있다.
- [ ] 수집하는 동안의 배치 히스토리를 저장한다.
  - [ ] 수집 타입
    - [ ] CSV, API ...
  - [ ] API 요청 수
  - [ ] DB 읽기/저장 수
  - [ ] 실패 수
  - [ ] 스킵 수
  - [ ] 시작/종료 시간, 걸린 시간
- [ ] 배치 히스토리를 조회할 수 있다.
  - [ ] 페이지네이션을 지원한다.
  - [ ] 배치 별 조회가 가능하다.
- [x] Merge Transaction을 조회할 수 있다.
  - [x] 페이지네이션이 가능하다.
  - [x] 기간에 따른 조회가 가능하다.
- [x] 수집 기능의 처리량 조절이 가능하다.
  - [x] 수집 중간에 딜레이를 줄 수 있다.
- [ ] 실패한 요청을 재시도할 수 있다.

    

--- 

## 요구 사항
- 4001포트 서버와 csv 파일에 저장되어 있는 Transaction과 4002포트 서버에 저장되어 있는 Store Transaction을 수집하여 Merge Transaction으로 병합 후 DB에 저장한다.
  - 10분 주기로 실행한다.
  - 이미 수집된 데이터는 저장하지 않는다.
- 저장된 Merge Transaction을 통해 기간별 거래 내역을 조회할 수 있다.
- 수집 중의 성능 측정을 위한 히스토리를 저장하고 조회할 수 있다.
- 데이터 처리량을 시간당으로 설정할 수 있다.
  - ex) 최대 처리량 초당 10건
  - API 부하 방지용
- 실패한 요청을 API로 재시도할 수 있다.
- 데이터베이스는 File Database를 사용한다.
- 최적화 방안
  - HTTP 요청 수 줄이기
  - DB 부하 줄이기
  - 확장이 쉬운 설계

---
## Mock Server
- 4001, 4002 포트의 대한 응답을 하는 가상 서버이다.
- Mock Server는 요청의 일부를 가상의 네트워크 오류를 보낸다.

---
## 데이터 인터페이스

- transactionId가 공통 필드이므로 각 Transaction에 일치하는 Store Transaction을 찾아 병합한다. (1:1 관계) 

### Transaction 인터페이스

```
{
  amount: number,
  balance: number,
  cancelYn: 'Y' | 'N',
  date: string, // yyyy-MM-dd
  storeId: string,
  transactionId: string
}
```

### Store Transaction 인터페이스

```
{
    storeId: string,
    transactionId: string,
    productId: string
}
```

### Merge Transaction 인터페이스

```
{
    amount: number,
    balance: number,
    cancelYn: 'Y' | 'N',
    date: string, // yyyy-MM-dd
    storeId: string,
    transactionId: string,
    productId: string
    ... 추가 가능
}
```
---

## 4001 포트 API

### Transaction 조회
query
- page {number}

#### Request
```
GET http://localhost:4001/transaction?page={number}
```

#### Response
```
{
    list: Transaction[],
    pageInfo: {
    totalPage: number
    }
}
```

### Store Transaction 조회

#### Request

params
- storeId {number}

```
POST http://localhost:4002/store-transaction/{storeId}

```

#### Response
```
{
    page: number,
    date: string // yyyy-MM-dd
}
```