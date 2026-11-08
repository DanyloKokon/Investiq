create or replace function public.add_financial_transaction(
    p_date date,
    p_description text,
    p_categorie text,
    p_sum numeric,
    p_type text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_user_id uuid := auth.uid();
    v_row jsonb;
    v_balance numeric;
    v_delta numeric;
begin
    if v_user_id is null then
        raise exception 'Authentication required';
    end if;

    if p_type not in ('costs', 'income') then
        raise exception 'Invalid transaction type';
    end if;

    if p_sum is null then
        raise exception 'Invalid transaction amount';
    end if;

    perform pg_catalog.pg_advisory_xact_lock(
        pg_catalog.hashtextextended(v_user_id::text, 0)
    );

    insert into public.data as inserted_row (
        date,
        description,
        categorie,
        sum,
        user_id,
        type
    )
    values (
        p_date,
        p_description,
        p_categorie,
        p_sum,
        v_user_id,
        p_type
    )
    returning pg_catalog.to_jsonb(inserted_row) into v_row;

    v_delta := case when p_type = 'income' then p_sum else -p_sum end;

    select user_balance.balance
    into v_balance
    from public."userBalance" as user_balance
    where user_balance.user_id = v_user_id
    for update;

    if found then
        update public."userBalance" as user_balance
        set balance = user_balance.balance + v_delta
        where user_balance.user_id = v_user_id
        returning user_balance.balance into v_balance;
    else
        insert into public."userBalance" (user_id, balance)
        values (v_user_id, v_delta)
        returning balance into v_balance;
    end if;

    return pg_catalog.jsonb_build_object('row', v_row, 'balance', v_balance);
end;
$$;

create or replace function public.delete_financial_transaction(p_row_id text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_user_id uuid := auth.uid();
    v_row jsonb;
    v_type text;
    v_sum numeric;
    v_balance numeric;
    v_delta numeric;
begin
    if v_user_id is null then
        raise exception 'Authentication required';
    end if;

    perform pg_catalog.pg_advisory_xact_lock(
        pg_catalog.hashtextextended(v_user_id::text, 0)
    );

    select pg_catalog.to_jsonb(transaction_row), transaction_row.type, transaction_row.sum
    into v_row, v_type, v_sum
    from public.data as transaction_row
    where transaction_row.row_id::text = p_row_id
      and transaction_row.user_id = v_user_id
    for update;

    if not found then
        raise exception 'Transaction not found';
    end if;

    delete from public.data as transaction_row
    where transaction_row.row_id::text = p_row_id
      and transaction_row.user_id = v_user_id;

    v_delta := case when v_type = 'income' then -v_sum else v_sum end;

    select user_balance.balance
    into v_balance
    from public."userBalance" as user_balance
    where user_balance.user_id = v_user_id
    for update;

    if found then
        update public."userBalance" as user_balance
        set balance = user_balance.balance + v_delta
        where user_balance.user_id = v_user_id
        returning user_balance.balance into v_balance;
    else
        insert into public."userBalance" (user_id, balance)
        values (v_user_id, v_delta)
        returning balance into v_balance;
    end if;

    return pg_catalog.jsonb_build_object('row', v_row, 'balance', v_balance);
end;
$$;

revoke all on function public.add_financial_transaction(date, text, text, numeric, text) from public;
revoke all on function public.delete_financial_transaction(text) from public;
grant execute on function public.add_financial_transaction(date, text, text, numeric, text) to authenticated;
grant execute on function public.delete_financial_transaction(text) to authenticated;
