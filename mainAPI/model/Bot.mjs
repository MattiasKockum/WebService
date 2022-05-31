class Bot {

  static id;
  static name;
  static status;
  //mod by xx
  // static mouth;
  // static brain;

  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.status = data.status;
    //mod by xx
    // this.mouth = data.mouth;
    // this.brain = data.brain;
  }   
  static isValidProperty(property,value) {
    if (property != 'id' && property != 'name' && property != 'status')
      return false
    return true
  }
  static isBot(obj) {
    if (!obj.id || !obj.name || !obj.status) {
      return false
    }
    return true
  }
}

export {Bot}