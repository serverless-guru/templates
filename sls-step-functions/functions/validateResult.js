function InvalidNumberError(resultVar) {
  this.name = 'InvalidNumberError';
  this.message = `${resultVar} is not a number!`;
}
InvalidNumberError.prototype = new Error();

function NumberIsBig(resultVar, max) {
  this.name = 'NumberIsBig';
  this.message = `${resultVar} is bigger than ${max}!`;
}
NumberIsBig.prototype = new Error();

module.exports.handler = async (resultNumber, context) => {
  if (!resultNumber) {
    //Just for  Proof of concept demo throw 'InvalidNumberError' exception when result number in invalid
    throw new InvalidNumberError("resultNumber");
  } else if (resultNumber > 100) {
    //Just for  Proof of concept demo throw 'NumberIsBig' exception when result number is greater then 100
    throw new NumberIsBig("resultNumber", 100);
  } else if (resultNumber < 0) {
    //Just for  Proof of concept demo represent timeout step
    while (true) {
      // let it timeout
    }
  } else {
    return resultNumber;
  }
};