UPDATE patient
set firstname=$2, lastname=$3, email=$4, phone_num=$5, dob=$6, gender=$7
where id=$1;
