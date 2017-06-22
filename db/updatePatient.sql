UPDATE patient
set firstname=$1, lastname=$2, email=$3, phone_num=$4, dob=$5, gender=$5
where id=$6;
