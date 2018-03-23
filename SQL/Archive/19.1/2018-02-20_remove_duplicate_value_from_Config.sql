/*  delete duplicate ConfigID-value pairs */

Delete from Config  Where ID in
    (
      select temp.ID from
       (select ID from Config c
          where (c.ConfigId,c.Value) in (select ConfigId,Value from Config group by ConfigId,Value having count(*) > 1)
          and ID not in (select min(ID) from Config group by ConfigId,Value having count(*)>1)
       ) temp
    );
