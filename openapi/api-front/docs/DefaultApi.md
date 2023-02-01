# ViandeendirectApi.DefaultApi

All URIs are relative to *http://localhost:8080*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deliveriesGet**](DefaultApi.md#deliveriesGet) | **GET** /deliveries | Get all deliveries



## deliveriesGet

> [Delivery] deliveriesGet()

Get all deliveries

Retreive the deliveries available for buying food. The past deliveries are excluded.

### Example

```javascript
import ViandeendirectApi from '@viandeendirect/api';

let apiInstance = new ViandeendirectApi.DefaultApi();
apiInstance.deliveriesGet().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

This endpoint does not need any parameter.

### Return type

[**[Delivery]**](Delivery.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

