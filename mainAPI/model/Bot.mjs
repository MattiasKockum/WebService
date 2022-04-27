class Bot{

  static id;
  static name;
  static status;
  static mouth;
  static brain;

  constructor(data){
    this.id = data.id;
    this.name = data.name;
    this.status = data.status;
    this.mouth = data.mouth;
    this.brain = data.brain;
  }
}

export {Bot}