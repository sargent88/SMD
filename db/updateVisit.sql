UPDATE patient
set date=$1, area_hurt=$2, reason=$3, prescription=$4, followup=$5, notes=$5
where visit_id=$6;