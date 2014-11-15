# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('todos', '0002_timelogentry'),
    ]

    operations = [
        migrations.CreateModel(
            name='ResourceChannel',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('token', models.CharField(max_length=32)),
                ('todoList', models.ForeignKey(to='todos.ToDoItemList')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
