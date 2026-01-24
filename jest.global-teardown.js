module.exports = async () => {
  if (global.__NEXT_SERVER_PROCESS__) {
    global.__NEXT_SERVER_PROCESS__.kill();
  }
};
