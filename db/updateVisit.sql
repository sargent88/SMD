UPDATE visit
set date=$2, area_hurt=$3, reason=$4, prescription=$5, followup=$6, notes=$7
where visit_id=$1;