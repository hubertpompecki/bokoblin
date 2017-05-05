// @flow

// AWS Lambda will call this method
exports.process = async (event: {}, context: {}, callback: (Error | null, any) => void) => {
  callback(null, 'Hello, World!')
}
