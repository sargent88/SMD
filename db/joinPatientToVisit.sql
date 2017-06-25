select visit_id, date, area_hurt, reason, prescription, followup, notes
from visit
where patient_id=$1
order by visit_id