import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hashedPassword) => {
    console.log("📌 Password ingresada (longitud):", password.length);
    console.log("📌 Password almacenada (longitud):", hashedPassword.length);
  
    console.log("📌 Password ingresada (hex):", Buffer.from(password).toString('hex'));
    console.log("📌 Password almacenada (hex):", Buffer.from(hashedPassword).toString('hex'));
  
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log("📌 ¿Las contraseñas coinciden?", isMatch);
  
    return isMatch;
  };
  