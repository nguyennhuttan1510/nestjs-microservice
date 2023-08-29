import * as bcrypt from 'bcrypt';

const encryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (password: string, hashPassword: string) => {
  return await bcrypt.compare(password, hashPassword);
};
const Helper = {
  encryptPassword,
  comparePassword,
};

export default Helper;
