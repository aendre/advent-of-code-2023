interface String {
  lines(): string[];
  toInteger(): number;
}

String.prototype.lines = function lines() {
  return this.split('\n')
}
