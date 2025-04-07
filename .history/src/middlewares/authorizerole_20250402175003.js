`INSERT INTO logins_coordenacao (email, codigo_otp, ip, usado, data_envio, data_login) 
VALUES ($1, $2, $3, $4, $5, now(), DEFAULT) 
RETURNING id`,
[email, bcrypt_code, ip_user, false]