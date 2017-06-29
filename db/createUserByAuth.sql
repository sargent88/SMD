insert into users
(email, auth_id, username, type)
values ($1, $2, $3, 4)
returning *;