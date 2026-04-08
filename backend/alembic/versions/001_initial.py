"""Initial migration

Revision ID: 001
Revises:
Create Date: 2024-01-01 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('password_hash', sa.String(), nullable=False),
        sa.Column('age', sa.Integer(), nullable=False),
        sa.Column('subscription_type', sa.String(), nullable=False, server_default='free'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_users_email', 'users', ['email'], unique=True)
    op.create_index('ix_users_id', 'users', ['id'], unique=False)

    op.create_table('zones',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('color_code', sa.String(), nullable=False),
        sa.Column('icon_emoji', sa.String(), nullable=False),
        sa.Column('is_locked_free', sa.Boolean(), nullable=False, server_default='false'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_zones_id', 'zones', ['id'], unique=False)

    op.create_table('professions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('zone_id', sa.Integer(), nullable=False),
        sa.Column('difficulty', sa.Integer(), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('chibi_emoji', sa.String(), nullable=False),
        sa.ForeignKeyConstraint(['zone_id'], ['zones.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_professions_id', 'professions', ['id'], unique=False)

    op.create_table('characters',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('profession_id', sa.Integer(), nullable=False),
        sa.Column('sprite_url', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.ForeignKeyConstraint(['profession_id'], ['professions.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_characters_id', 'characters', ['id'], unique=False)

    op.create_table('levels',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('profession_id', sa.Integer(), nullable=False),
        sa.Column('order_index', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('type', sa.String(), nullable=False),
        sa.Column('teaching_text', sa.Text(), nullable=False),
        sa.ForeignKeyConstraint(['profession_id'], ['professions.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_levels_id', 'levels', ['id'], unique=False)

    op.create_table('tasks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('level_id', sa.Integer(), nullable=False),
        sa.Column('question', sa.Text(), nullable=False),
        sa.Column('options', sa.JSON(), nullable=False),
        sa.Column('correct_answer', sa.String(), nullable=False),
        sa.Column('explanation', sa.Text(), nullable=False),
        sa.ForeignKeyConstraint(['level_id'], ['levels.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_tasks_id', 'tasks', ['id'], unique=False)

    op.create_table('user_progress',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('profession_id', sa.Integer(), nullable=False),
        sa.Column('completed_levels', sa.JSON(), nullable=True),
        sa.Column('xp', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['profession_id'], ['professions.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_user_progress_id', 'user_progress', ['id'], unique=False)

    op.create_table('subscriptions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('type', sa.String(), nullable=False, server_default='free'),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_subscriptions_id', 'subscriptions', ['id'], unique=False)


def downgrade() -> None:
    op.drop_table('subscriptions')
    op.drop_table('user_progress')
    op.drop_table('tasks')
    op.drop_table('levels')
    op.drop_table('characters')
    op.drop_table('professions')
    op.drop_table('zones')
    op.drop_table('users')
