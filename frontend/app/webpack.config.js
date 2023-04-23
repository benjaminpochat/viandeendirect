export default function () {
    return {
      resolve: {
        fallback: {
          querystring: require.resolve("querystring-es3"),
        }
      }
    }
  }