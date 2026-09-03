-- Local development data only. Never runs against production: `supabase db
-- reset` applies this to the local stack after migrations.
--
-- Generates ~9 weeks of feedback across three batches, with quality improving
-- batch over batch, so the trend line, batch comparison and "what to change
-- next" panel all have a real story to show. Sweetness is deliberately the
-- weakest attribute.

truncate table public.feedback, public.subscribers;

insert into public.feedback (
    created_at, batch, rating, texture, sweetness, chocolate_flavor,
    portion_size, buy_again, comment
)
select
    now() - (days_ago || ' days')::interval - (random() * interval '12 hours'),
    batch,
    rating,
    (array['too_soft', 'just_right', 'just_right', 'just_right', 'too_firm'])[1 + floor(random() * 5)],
    -- Skewed hard towards "too sweet" so the weakest-attribute panel has a clear winner.
    (array['not_sweet_enough', 'just_right', 'too_sweet', 'too_sweet', 'too_sweet'])[1 + floor(random() * 5)],
    (array['too_light', 'just_right', 'just_right', 'too_rich'])[1 + floor(random() * 4)],
    (array['too_small', 'just_right', 'just_right', 'too_much'])[1 + floor(random() * 4)],
    case
        when rating >= 4 then (array['definitely', 'definitely', 'maybe'])[1 + floor(random() * 3)]
        when rating = 3 then 'maybe'
        else 'probably_not'
    end,
    case
        when random() < 0.35 then (array[
            'Genuinely the best brownie I have had in ages. The edges were perfect.',
            'Lovely but a bit too sweet for me, I could not finish a whole one.',
            'Really rich. Would happily buy a box for the office.',
            'Texture was spot on, chocolate a little intense.',
            'Too sweet, and the portion was bigger than I needed.',
            'My kids demolished these. Please keep making them.',
            'Good, though slightly dry at the corners.',
            'Perfect with coffee. Sweetness just right for me.',
            'A little too sugary, otherwise excellent.',
            'Best texture of any brownie I have bought locally.'
        ])[1 + floor(random() * 10)]
        else ''
    end
from (
    select
        days_ago,
        case
            when days_ago > 42 then 'batch-01'
            when days_ago > 21 then 'batch-02'
            else 'batch-03'
        end as batch,
        -- Later batches skew higher, so period-over-period deltas are positive.
        case
            when days_ago > 42 then (array[2, 3, 3, 4, 4, 5])[1 + floor(random() * 6)]
            when days_ago > 21 then (array[3, 3, 4, 4, 5, 5])[1 + floor(random() * 6)]
            else (array[3, 4, 4, 5, 5, 5])[1 + floor(random() * 6)]
        end as rating
    from generate_series(0, 62) as days_ago,
         -- 0-3 responses per day, so the trend has natural gaps. Derived from
         -- days_ago rather than random(): random() in a generate_series bound
         -- is evaluated once for the whole query, which gives every day an
         -- identical count.
         generate_series(1, abs(hashtext('d' || days_ago)) % 4)
) as rows;

insert into public.subscribers (email, marketing_consent, batch, consented_at)
select
    'customer' || n || '@example.com',
    random() < 0.75,
    (array['batch-01', 'batch-02', 'batch-03'])[1 + floor(random() * 3)],
    now() - (floor(random() * 62) || ' days')::interval
from generate_series(1, 48) as n;
