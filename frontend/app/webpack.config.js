import { watch } from "fs";

export default function () {
    return {
      resolve: {
        fallback: {
          querystring: require.resolve("querystring-es3"),
        }
      },
      watchOptions: {
        ignored: '**/node_modules',
      }
    }
  }