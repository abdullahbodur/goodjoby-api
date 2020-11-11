const CustomError = require("../error/CustomError");

const stateControl = (state) => {
  const { STATE_PASSIVE, STATE_FINISHED, STATE_CANCELED } = process.env;
  if (
    [
      parseInt(STATE_PASSIVE),
      parseInt(STATE_FINISHED),
      parseInt(STATE_CANCELED),
    ].includes(state)
  ) return true;
};

module.exports = { stateControl };
